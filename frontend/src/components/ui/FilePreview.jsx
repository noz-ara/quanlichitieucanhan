import React from 'react';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  font-size: 1rem;
  width: 50px;
  height: 50px;
  /* border: 1px solid lightgrey; */
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FilePreview = ({ file }) => {
  // Check if a file is provided
  if (!file) {
    return <PreviewContainer>Không có tệp nào được chọn</PreviewContainer>;
  }

  // Check if the file is an image
  if (file.type.startsWith('image/')) {
    return (
      <PreviewContainer>
        <img src={URL.createObjectURL(file)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </PreviewContainer>
    );
  }

  // Return a default preview for other file types
  return <PreviewContainer>Không có bản xem trước</PreviewContainer>;
};

export default FilePreview;
