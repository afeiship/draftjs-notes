import React from 'react';
import { EditorState, Editor, RichUtils, AtomicBlockUtils } from 'draft-js';
// import Editor from 'draft-js-plugins-editor';
import { mediaBlockRenderer } from './entities/mediaBlockRenderer';
// import '../App.css';

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  onURLChange = (e) => this.setState({ urlValue: e.target.value });

  focus = () => this.refs.editor.focus();

  onAddImage = (e) => {
    e.preventDefault();
    const editorState = this.state.editorState;
    const urlValue = window.prompt('Paste Image Link');
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {
      src: urlValue
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      'create-entity'
    );
    this.setState(
      {
        editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
      },
      () => {
        setTimeout(() => this.focus(), 0);
      }
    );
  };

  onUnderlineClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  };

  render() {
    return (
      <div className="editorContainer">
        <div className="menuButtons">
          <button onClick={this.onUnderlineClick}>U</button>
          <button onClick={this.onBoldClick}>
            <b>B</b>
          </button>
          <button onClick={this.onItalicClick}>
            <em>I</em>
          </button>
          <button className="inline styleButton" onClick={this.onAddImage}>
            <i
              className="material-icons"
              style={{
                fontSize: '16px',
                textAlign: 'center',
                padding: '0px',
                margin: '0px'
              }}>
              image
            </i>
          </button>
        </div>
        <div className="editors">
          <Editor
            blockRendererFn={mediaBlockRenderer}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            plugins={this.plugins}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

export default PageContainer;
