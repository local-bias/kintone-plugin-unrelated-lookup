import styled from '@emotion/styled';

const Component = styled.div`
  display: grid;
  gap: 16px;

  grid-template:
    'sidebar form' minmax(600px, 1fr)
    'footer footer' auto/
    300px 1fr;

  @media (min-width: 1520px) {
    grid-template:
      'sidebar form promotion' minmax(600px, 1fr)
      'footer footer footer' auto/
      300px 1fr 300px;
  }
`;

export default Component;
