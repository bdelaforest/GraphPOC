import styled from "styled-components";

const Node = styled.div`
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  /* opacity: 0.8; */
`;

export const CompanyNode = styled(Node)`
  background: pink;
`;

export const PersonNode = styled(Node)`
  background: lightblue;
  border-radius: 50%;
`;
