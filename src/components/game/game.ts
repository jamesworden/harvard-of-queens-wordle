import { Status } from '../../utils/status'
import { WordUtils } from '../../utils'
import { board } from '../board'
import { keyboard } from '../keyboard'
import { requestWordModal } from '../request-word-modal'
import { toastMessage } from '../toast-message'
import { env } from '../../environments'

const { winMessage } = env

class Game {
  private readonly answer: string
  private readonly hint: string
  private running = true
  private currentGuess = ''
  currentRowIndex = 0

  constructor() {
    const { word, hint } = WordUtils.getTodaysWord()

    this.answer = word
    this.hint = hint
  }

  getTodaysHint() {
    return this.hint
  }

  init() {
    board.initBoard(this.answer.length)
  }

  isRunning() {
    return this.running
  }

  stealGuess() {
    this.currentGuess = ''

    for (let i = 0; i < this.answer.length; i++) {
      this.currentGuess += '-'
    }

    // Skip attemptGuess() because '------' are invalid characters.
    this.guess()
  }

  guess() {
    // CRITICAL: Guess may be accessed from code where isRunning
    // has not been verified. Leave this check.
    if (!this.isRunning()) {
      return
    }

    const letterComparisons = WordUtils.getLetterComparisons(
      this.currentGuess,
      this.answer
    )
    board.revealRow(letterComparisons, this.currentRowIndex)
    keyboard.updateColors(letterComparisons)
    this.currentGuess = ''
    this.currentRowIndex++

    // If all letters are correct or no more tries left, stop game
    const atLeastOneLetterNotCorrect = letterComparisons.some(
      letterComparison => letterComparison.status != Status.CORRECT
    )

    const allLettersCorrect = !atLeastOneLetterNotCorrect

    const noMoreTries = this.currentRowIndex >= board.getNumRows()

    if (allLettersCorrect || noMoreTries) {
      this.running = false
    }

    if (allLettersCorrect) {
      toastMessage.show(winMessage)
    } else if (noMoreTries) {
      toastMessage.show(`Answer: ${this.answer}`)
    }
  }

  attemptBackspace() {
    if (!this.isRunning()) {
      return
    }

    if (this.currentGuess.length <= 0) {
      return
    }

    this.currentGuess = this.currentGuess.substring(
      0,
      this.currentGuess.length - 1
    )
    board.updateTileTextAndBorderColor(this.currentGuess, this.currentRowIndex)
  }

  attemptType(key: string) {
    if (!this.isRunning()) {
      return
    }

    if (requestWordModal.isOpen()) {
      return
    }

    if (this.currentGuess.length >= this.answer.length) {
      return
    }

    const letterRegex = new RegExp(/[a-zA-Z]/)
    const keyIsLetter = letterRegex.test(key) && key.length === 1

    if (!keyIsLetter) {
      return
    }

    this.currentGuess += key
    const tileIndex = this.currentGuess.length - 1
    board.bounceTile(this.currentRowIndex, tileIndex)
    board.updateTileTextAndBorderColor(this.currentGuess, this.currentRowIndex)
  }

  attemptGuess() {
    if (!this.isRunning()) {
      return
    }

    if (requestWordModal.isOpen()) {
      return
    }

    if (this.currentGuess.length != this.answer.length) {
      toastMessage.show('Not enough letters')
      board.shakeRow(this.currentRowIndex)
      return
    }

    if (!WordUtils.isValidGuess(this.currentGuess)) {
      toastMessage.show('Not in word list')
      board.shakeRow(this.currentRowIndex)
      return
    }

    this.guess()
  }
}

export const game = new Game()
