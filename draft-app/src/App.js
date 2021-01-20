import React from 'react';
import {
  EditorState,
  Editor,
  RichUtils,
  Modifier,
  CompositeDecorator,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils
} from 'draft-js';
// import Editor from 'draft-js-plugins-editor';
import { mediaBlockRenderer } from './entities/mediaBlockRenderer';
import Immutable from 'immutable';
import { ENTITY_TYPE } from 'draft-js-utils';
import ImageDecorator from './entities/image-decorator';
import 'draft-js/dist/Draft.css';
import './App.css';
// https://medium.com/@siobhanpmahoney/building-a-rich-text-editor-with-react-and-draft-js-part-2-4-persisting-data-to-server-cd68e81c820
// https://stackoverflow.com/questions/62249348/i-am-trying-to-use-draft-js-where-i-need-to-add-inline-image-and-text
// import '../App.css';

class SpanWrap extends React.Component {
  render() {
    return <span {...this.props} />;
  }
}

const blockRenderMap = Immutable.Map({
  atomic: {
    element: 'span'
  }
});

const decorator = new CompositeDecorator([ImageDecorator]);

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  console.log('type:', type);
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }

  if (type === 'unstyled') {
    return 'block-unstyled';
  }

  if (type === 'atomic') {
    return 'f-atomic';
  }
}

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

console.log(extendedBlockRenderMap, DefaultDraftBlockRenderMap);

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(decorator)
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

  onAddLatex = (e) => {
    e.preventDefault();
    const editorState = this.state.editorState;
    const urlValue = window.prompt('Paste latex value');
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('latex', 'IMMUTABLE', {
      value: urlValue
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      'create-entity'
    );

    // text
    const target1 = Modifier.insertText(
      contentStateWithEntity,
      editorState.getSelection(),
      ' ',
      null,
      entityKey
    );

    //  atomic block
    const target2 = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');

    this.setState(
      {
        editorState: target2
      },
      () => {
        setTimeout(() => this.focus(), 0);
      }
    );
  };

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

  onAddImage2 = () => {
    // https://github.com/sstur/react-rte/blob/master/src/lib/EditorToolbar.js
    const editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    const src = 'https://himg.bdimg.com/sys/portrait/item/be10475f686d6c73db00.jpg';
    contentState = contentState.createEntity(ENTITY_TYPE.IMAGE, 'IMMUTABLE', { src });
    let entityKey = contentState.getLastCreatedEntityKey();
    let newContentState = Modifier.insertText(contentState, selection, ' ', null, entityKey);
    const target = EditorState.push(editorState, newContentState);
    console.log(target);
    this.setState(
      {
        editorState: target
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
          <button onClick={this.onAddLatex}>latex</button>
          <button className="inline styleButton" onClick={this.onAddImage2}>
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
            placeholder="type text..."
            blockRendererFn={mediaBlockRenderer}
            blockRenderMap={extendedBlockRenderMap}
            editorState={this.state.editorState}
            blockStyleFn={myBlockStyleFn}
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
