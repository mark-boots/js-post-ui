import { setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

function setFormValues(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl)

  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

function getFormValue(form) {
  const formValues = {}
  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValues[name] = field.value
  // })

  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test('at-least-two-words', 'Please enter at least two words', (value) => {
        value.split(
          ' '.filter((x) => {
            !!x && x.length >= 3
          }).length >= 2
        )
      }),
    description: yup.string(),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) element.setCustomValidity(error)
  setTextContent(form.parentElement, '.invalid-feedback', error)
}

async function validatePostForm(form, formValues) {
  try {
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    console.log(error.name)
    console.log(error.inner)

    for (const validationError of error.inner) {
      const name = validationError.path
      setFieldError(form, name, validationError.message)
    }
  }

  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    console.log('submit form')

    const formValues = getFormValue(form)
    console.log(formValues)
    if (!validatePostForm(form, formValues)) return
  })
}
