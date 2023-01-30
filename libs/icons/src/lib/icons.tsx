import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface IconsProps {}

const StyledIcons = styled.div`
  color: pink;
`;

export function Icons(props: IconsProps) {
  return (
    <StyledIcons>
      <h1>Welcome to Icons!</h1>
    </StyledIcons>
  );
}

export default Icons;
