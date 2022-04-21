import { game } from '../game'
import { requestWordModal } from '../request-word-modal'
import { toastMessage } from '../toast-message'
import { env } from '../../environments'

const { title } = env

class Toolbar {
  private requestWordModalOpenButton = document.getElementById(
    'request-word-modal-open-button'
  )
  private helpButton = document.getElementById('help-button')
  private title = document.getElementById('title')

  constructor() {
    this.initRequestWordModalButton()
    this.initHelpButton()
    this.initTitleText()
  }

  initTitleText() {
    this.title.textContent = title
  }

  initRequestWordModalButton() {
    this.requestWordModalOpenButton.addEventListener('click', () => {
      if (requestWordModal.isOpen()) {
        requestWordModal.close()
      } else {
        requestWordModal.open()
      }
    })
  }

  initHelpButton() {
    this.helpButton.addEventListener('click', () => {
      if (game.isRunning()) {
        toastMessage.show("You shouldn't need help.")
        game.stealGuess()
      } else {
        toastMessage.show("The game is over, you don't need help!")
      }
    })
  }
}

export const toolbar = new Toolbar()
