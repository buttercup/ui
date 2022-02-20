import styled from "styled-components";

export const SmallType = styled.p`
    font-size: 0.8rem;
    color: var(--gray-dark);
    margin: 2rem 0 0 0;
    border-top: ${props => (props.border ? "1px solid var(--gray)" : "none")};
    padding-top: ${props => (props.border ? "1rem" : "0")};
    text-align: ${props => (props.center ? "center" : "inherit")};

    svg {
        vertical-align: -4px !important;
        font-size: 1rem;
    }
`;

export const Center = styled.div`
    text-align: center;
`;
