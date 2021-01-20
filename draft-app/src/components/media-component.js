import React from 'react';

export default class MediaComponent extends React.Component {
  render() {
    const { block, contentState } = this.props;
    const { foo } = this.props.blockProps;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    // Return a <figure> or some other content using this data.
    return (
      <figure>
        {data} - {foo}
      </figure>
    );
  }
}
