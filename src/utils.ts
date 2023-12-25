export function generateShortId() {
  return Math.random().toString(36).substring(2, 9)
}

export function shuffleArrayInPlace(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5)
}

export function downloadJsonAsFile(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data)])
  const link = document.createElement('a')
  link.download = filename
  link.href = window.URL.createObjectURL(blob)
  link.click()
}
