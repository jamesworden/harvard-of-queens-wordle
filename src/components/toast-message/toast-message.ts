class ToastMessage {
  private readonly self = document.getElementById('toast-message')
  private readonly showTime = 3000
  private readonly bufferBetweenShowing = 250
  private readonly showClassName = 'show'
  private isShowing = false

  show(message: string) {
    if (this.isShowing) {
      return
    }

    this.self.classList.add(this.showClassName)
    this.self.innerHTML = message
    this.isShowing = true

    setTimeout(() => {
      this.self.innerHTML = ''
      this.self.classList.remove(this.showClassName)
    }, this.showTime)

    setTimeout(() => {
      this.isShowing = false
    }, this.showTime + this.bufferBetweenShowing)
  }
}

export const toastMessage = new ToastMessage()
