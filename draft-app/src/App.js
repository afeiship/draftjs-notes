import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils } from 'draft-js';
import MediaComponent from './components/media-component';
import 'draft-js/dist/Draft.css';

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
}

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    console.log(command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    console.log(type);
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          foo: 'bar'
        }
      };
    }
  };

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (
      <div>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <Editor
          blockStyleFn={myBlockStyleFn}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          blockRendererFn={this.blockRendererFn}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default MyEditor;
