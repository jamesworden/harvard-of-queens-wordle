import { Status } from '../../utils/status'
import { LetterComparison } from '../../utils'

class Board {
  private self = document.getElementById('board')
  private numRows = 6
  private tileRowClassName = 'tile-row'
  private tileClassName = 'tile'

  private getRow(rowIndex: number) {
    return this.self
      .getElementsByClassName(this.tileRowClassName)
      .item(rowIndex)
  }

  private getTilesFromRow(rowIndex: number) {
    return this.getRow(rowIndex).getElementsByClassName(this.tileClassName)
  }

  private getTile(rowIndex: number, tileIndex: number) {
    const tiles = this.getTilesFromRow(rowIndex)
    return tiles.item(tileIndex)
  }

  getNumRows() {
    return this.numRows
  }

  initBoard(answerLength: number) {
    for (let i = 0; i < this.numRows; i++) {
      const row = this.createRow(answerLength)
      this.self.appendChild(row)
    }
  }

  createRow(answerLength: number) {
    const row = document.createElement('div')
    row.classList.add(this.tileRowClassName)

    for (let i = 0; i < answerLength; i++) {
      const tile = this.createTile()
      row.appendChild(tile)
    }

    return row
  }

  createTile() {
    const tile = document.createElement('div')
    tile.classList.add(this.tileClassName)
    tile.setAttribute('maxLength', '1')

    return tile
  }

  updateTileTextAndBorderColor(currentGuess: string, rowIndex: number) {
    for (
      let tileIndex = 0;
      tileIndex < this.getTilesFromRow(rowIndex).length;
      tileIndex++
    ) {
      const tile = this.getTilesFromRow(rowIndex).item(tileIndex)
      const char = currentGuess.charAt(tileIndex)

      tile.textContent = char

      if (char) {
        tile.classList.add('current-guess')
      } else {
        tile.classList.remove('current-guess')
      }
    }
  }

  shakeRow(rowIndex: number) {
    const row = this.getRow(rowIndex)

    row.classList.add('shake')

    setTimeout(() => {
      row.classList.remove('shake')
    }, 1000)
  }

  resetTileText(rowIndex: number) {
    const tiles = this.getTilesFromRow(rowIndex)

    for (let i = 0; i < tiles.length; i++) {
      tiles.item(i).innerHTML = ''
    }
  }

  bounceTile(rowIndex: number, tileIndex: number) {
    const tile = this.getTile(rowIndex, tileIndex)

    tile.classList.add('bounce')

    setTimeout(() => {
      tile.classList.remove('bounce')
    }, 500)
  }

  flipTile(tileIndex: number, rowIndex: number) {
    const tile = this.getTile(rowIndex, tileIndex)

    tile.classList.add('flip')

    setTimeout(() => {
      tile.classList.remove('flip')
    }, 500)
  }

  colorTile(tileIndex: number, rowIndex: number, status: Status) {
    const tile = this.getTile(rowIndex, tileIndex)
    tile.classList.remove('current-guess')
    tile.classList.add(status)
  }

  revealTileWithDelay(tileIndex: number, rowIndex: number, status: Status) {
    const flipDelay = 500 + tileIndex * 500 // Starts with 0
    const colorDelay = flipDelay + 250

    setTimeout(() => {
      this.flipTile(tileIndex, rowIndex)
    }, flipDelay)

    setTimeout(() => {
      this.colorTile(tileIndex, rowIndex, status)
    }, colorDelay)
  }

  revealRow(letterComparisons: LetterComparison[], rowIndex: number) {
    const tiles = this.getTilesFromRow(rowIndex)

    for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
      const { status } = letterComparisons.find(
        letterComparison => letterComparison.tileIndex === tileIndex
      )

      this.revealTileWithDelay(tileIndex, rowIndex, status)
    }
  }
}

export const board = new Board()
