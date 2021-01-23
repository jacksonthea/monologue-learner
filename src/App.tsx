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
  listening: boolean;
  interimResult: string;
  finalResult: string;
  monologueText: string;
};

class Speech extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listening: false,
      interimResult: "",
      finalResult: "",
      monologueText: "",
    };
  }

  handleChangeMonologueText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ monologueText: event.target.value });
  };

  toggleListenButton = () => {
    this.setState(
      {
        listening: !this.state.listening,
      },
      this.setRecognitionCallbacls
    );
  };

  setRecognitionCallbacls = () => {
    console.log("listening?", this.state.listening);

    if (this.state.listening) {
      this.setState({
        interimResult: "",
        finalResult: "",
      });
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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const { finalResult } = this.state;
      var interimResultLocal = "";
      var finalResultLocal = finalResult;

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalResultLocal += event.results[i][0].transcript;
        } else {
          interimResultLocal += event.results[i][0].transcript;
        }
      }
      this.setState({
        interimResult: interimResultLocal,
        finalResult: finalResultLocal,
      });
    };

    //-----------------------------------------------------------------------

    recognition.onerror = (event: SpeechRecognitionEvent) => {
      console.log("Error occurred in recognition: " + event);
    };
  };

  renderListeningDisplayBox = () => {};

  render() {
    const { listening, interimResult, finalResult } = this.state;
    const textAreaDimensions = { width: 500, height: 200, padding:20};
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
          <span id="interim_span" style={{color: "black"}}>
            {finalResult}
          </span>
          <span id="interim_span" style={{color: "gray"}}>
            {interimResult}
          </span>
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
          onClick={this.toggleListenButton}
        />
      </div>
    );
  }
}

export default Speech;
