import { ENTITY_TYPE } from 'draft-js-utils';
import React from 'react';

class ImageSpan extends React.Component {
  render() {
    console.log(this.props);
    const entity = this.props.contentState.getEntity(this.props.entityKey);
    const { src } = entity.getData();

    return (
      <span>
        <img src={src} />
        {this.props.children}
      </span>
    );
  }
}

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    if (entityKey != null) {
      let entity = contentState ? contentState.getEntity(entityKey) : null;
      return entity != null && entity.getType() === ENTITY_TYPE.IMAGE;
    }
    return false;
  }, callback);
}

export default {
  strategy: findImageEntities,
  component: ImageSpan
};
