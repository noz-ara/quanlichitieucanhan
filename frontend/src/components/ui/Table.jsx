import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';
import ButtonIcon from './ButtonIcon';
import ButtonsGroup from './ButtonsGroup';

// Styled table components
export const TableContainer = styled.div`
  width: 100%;
  max-width: 90%;
  border-collapse: collapse;
  overflow: scroll;
  overflow-x: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableElement = styled.table`
  color: var(--color-grey-100);
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  font-weight: bold;
  border: 1px solid var(--color-silver-700);
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  background-color: var(--color-silver-100);
  color: var(--color-silver-100);
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
`;

export const TableCell = styled.td`
  max-width: 300px;
  border: 1px solid var(--color-grey-300);
  padding: 1rem;
  color: var(--color-silver-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function formatHeader(header) {
  // Split the header text by capital letters
  const words = header.split(/(?=[A-Z])/);
  // Convert words to lowercase and join with dashes
  return words.map(word => word.toLowerCase()).join('-');
}

const Table = ({ headers, data, actions }) => {
  // Add 'Actions' header
  const headersWithActions = [...headers, 'Actions'];

  return (
    <TableContainer>
      <TableElement>
        <TableHead>
          <TableRow>
            {/* Render all headers including action headers */}
            {headersWithActions.map(header => (
              <TableCell key={header}>{formatHeader(header)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {/* Render data cells */}
              {headers.map(header => (
                <TableCell key={header}>{item[header]}</TableCell>
              ))}
              {/* Render action buttons */}
              <TableCell>
              <ButtonsGroup>
                {actions.map((action, actionIndex) => (
                  <ButtonIcon
                    key={actionIndex}
                    color={action.color}
                    iconSize='2.1rem'
                    // variation='text'
                    onClick={() => action.onClick(item)}
                  >
                    {action.icon} {action.label}
                  </ButtonIcon>
                ))}
                </ButtonsGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableElement>
    </TableContainer>
  );
};

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired, 
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

export default Table;