class RequestWordModal {
  private readonly self = document.getElementById('request-word-modal')
  private readonly form = document.getElementById('request-word-form')
  private readonly formInputs = this.form.querySelectorAll('input')
  private readonly responseText = document.getElementById(
    'request-word-response-text'
  )
  private readonly closeButton = document.getElementById(
    'request-word-modal-close-button'
  )

  // TODO: get from environment file
  private readonly submitUrl =
    'https://ex0av8epzj.execute-api.us-east-1.amazonaws.com/Production/'

  constructor() {
    this.initCloseButton()
    this.initFormSubmit()
  }

  isOpen() {
    return this.self.classList.contains('open')
  }

  isFading() {
    return (
      this.self.classList.contains('fade-in') ||
      this.self.classList.contains('fade-out')
    )
  }

  open() {
    if (requestWordModal.isFading()) return

    this.self.classList.add('open')
    this.self.classList.add('fade-in')

    setTimeout(() => {
      this.self.classList.remove('fade-in')
    }, 500)
  }

  close() {
    if (requestWordModal.isFading()) return

    this.self.classList.remove('open')
    this.self.classList.add('fade-out')

    setTimeout(() => {
      this.self.classList.remove('fade-out')
      this.setResponseText('')
    }, 500)
  }

  private setResponseText(text: string) {
    this.responseText.textContent = text
  }

  initCloseButton() {
    this.closeButton.addEventListener('click', () => {
      this.close()
    })
  }

  // TODO: Break this function up (create XMLHttpRequest service?)
  initFormSubmit() {
    this.form.onsubmit = event => {
      event.preventDefault()

      // Capture and validate the form data
      const body: { [key: string]: string } = {}

      for (const input of this.formInputs) {
        if (input.value.trim().length === 0) {
          this.setResponseText(`Try filling out the ${input.name} field.`)
          return
        }

        body[input.id] = input.value
      }

      this.setResponseText('Sending...')

      // Prefix the wordle word
      const word = body.message
      body.message = `Wordle request: ${word}`

      // Create the AJAX request
      var xhr = new XMLHttpRequest()
      xhr.open('POST', this.submitUrl, true)
      xhr.setRequestHeader('Accept', 'application/json; charset=utf-8')
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

      // Send the collected data as JSON
      const stringifiedJsonBody = JSON.stringify(body)
      xhr.send(stringifiedJsonBody)

      xhr.onloadend = () => {
        if (xhr.status === 200) {
          this.resetForm()
          this.setResponseText('I got your message.')
        } else {
          this.setResponseText("Sorry, the message didn't send.")
        }
      }
    }
  }

  resetForm() {
    for (const input of this.formInputs) {
      if (input.type != 'submit') {
        input.value = ''
      }
    }
  }
}

export const requestWordModal = new RequestWordModal()
