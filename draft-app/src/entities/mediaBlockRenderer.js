import React from 'react';
import { EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import katex from 'katex';

class Latex extends React.Component {
  componentDidMount() {
    const { value } = this.props;
    katex.render(value, this.root, {
      throwOnError: false
    });
  }

  render() {
    return <span className="std-latex" ref={(root) => (this.root = root)}></span>;
  }
}

export const mediaBlockRenderer = (block) => {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false
    };
  }

  return null;
};

const Image = (props) => {
  if (!!props.src) {
    return <img className="std-image" src={props.src} />;
  }
  return null;
};

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, value } = entity.getData();
  const type = entity.getType();

  let media;

  if (type === 'image') {
    media = <Image src={src} />;
  }

  if (type === 'latex') {
    media = <Latex value={value} />;
  }

  return media;
};
