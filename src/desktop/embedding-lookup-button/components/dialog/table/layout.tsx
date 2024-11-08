import styled from '@emotion/styled';
import { FCwC } from 'react';

const Component: FCwC = ({ className, children }) => <div {...{ className }}>{children}</div>;

const StyledDialogTableLayoutComponent = styled(Component)`
  table {
    width: 100%;
    padding: 0 16px 16px;
    white-space: nowrap;
    background-color: #fff;
    font-size: 88%;
    @media screen {
      border-collapse: separate;
    }
    @media print {
      font-size: 100%;
    }

    th {
      font-weight: 400;
    }

    td {
      border-right: 1px solid #0002;
    }

    th,
    td {
      padding: 8px 15px;
      &:first-of-type {
        border-left: 1px solid #0002;
      }
      &:last-of-type {
        border-right: 1px solid #0002;
      }
    }

    thead {
      tr {
        th {
          background-color: #fff;
          border-bottom: 1px solid #0002;
          border-top: 1px solid #0002;
          padding: 10px 15px;
          @media screen {
            position: sticky;
            top: 60px;
            z-index: 1;
          }
        }
      }
    }

    tbody {
      tr {
        line-height: 30px;
        cursor: pointer;

        td {
          background-color: #fff;
        }

        &:nth-of-type(2n) {
          td {
            background-color: #f5f5f5;
          }
        }

        &:last-of-type {
          td {
            border-bottom: 1px solid #0002;
          }
        }

        &:hover {
          td {
            filter: brightness(0.95);
          }
        }
      }
    }
  }
`;

export default StyledDialogTableLayoutComponent;
