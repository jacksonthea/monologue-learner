import React from 'react'
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
const {webkitSpeechRecognition} = (window as any);

// const speachRecognition: any = SpeechRecognition || webkitSpeechRecognition
const recognition = new webkitSpeechRecognition()

recognition.continuous = true
recognition.interimResults = true
recognition.lang = 'en-US'

function App() {
  return (
    <div className="App">
      <text>{recognition.lang}</text>
    </div>
  )
}

export default App;
