import React, { Component } from "react";
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
const { webkitSpeechRecognition } = window as any;

// const speachRecognition: any = SpeechRecognition || webkitSpeechRecognition
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

type Props = {};
type State = {
  listening: boolean,
  listeningResult: string,
  monologueText: string,
};

class Speech extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listening: false,
      listeningResult: "",
      monologueText: "",
    };
  }

  handleChangeMonologueText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ monologueText: event.target.value });
  };

  toggleListen = () => {
    this.setState(
      {
        listening: !this.state.listening,
      },
      this.handleListen
    );
  };

  handleListen = () => {
    console.log("listening?", this.state.listening);

    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        console.log("...continue listening...");
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("Stopped listening per click");
      };
    }

    recognition.onstart = () => {
      console.log("Listening!");
    };

    let finalTranscript = "";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      const interim_item = document.getElementById("interim");
      if (interim_item) {
        interim_item.innerHTML = interimTranscript;
      }

      const final_item = document.getElementById("final");
      if (final_item) {
        final_item.innerHTML = finalTranscript;
      }

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(" ");
      const stopCmd = transcriptArr.slice(-3, -1);
      console.log("stopCmd", stopCmd);

      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        recognition.stop();
        recognition.onend = () => {
          console.log("Stopped listening per command");
          const finalText = transcriptArr.slice(0, -3).join(" ");

          const final_item = document.getElementById("final");
          if (final_item) {
            final_item.innerHTML = finalText;
          }
        };
      }
    };

    //-----------------------------------------------------------------------

    recognition.onerror = (event: SpeechRecognitionEvent) => {
      console.log("Error occurred in recognition: " + event);
    };
  };

  renderListeningDisplayBox = () => {};

  render() {
    const { listening } = this.state;
    const textAreaDimensions = { width: 500, height: 200 };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={textAreaDimensions}>
          <textarea
            id="monologue-text"
            value={this.state.monologueText}
            onChange={this.handleChangeMonologueText}
            style={{ width: "100%", height: "100%", resize: "none" }}
            hidden={listening}
          ></textarea>
        </div>
        
        <div style={textAreaDimensions} id="interim">

        </div>

        <button
          id="microphone-btn"
          style={{
            width: "60px",
            height: "60px",
            background: listening ? "red" : "lightblue",
            borderRadius: "50%",
            margin: "6em 0 2em 0",
          }}
          onClick={this.toggleListen}
        />
        <div
          id="interim"
          style={{
            color: "gray",
            border: "#ccc 1px solid",
            padding: "1em",
            margin: "1em",
            width: "300px",
          }}
        ></div>
        <div
          id="final"
          style={{
            color: "black",
            border: "#ccc 1px solid",
            padding: "1em",
            margin: "1em",
            width: "300px",
          }}
        ></div>
      </div>
    );
  }
}

export default Speech;
