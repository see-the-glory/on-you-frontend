import { css } from "styled-components";

const mixIn = {
    flex: (
        flexDirection = "row",
        justfiycontent = "center",
        alignItems = "center"
    ) => css`
    display: flex;
    flex-direction: ${flexDirection};
    justify-content: ${justfiycontent};
    align-items: ${alignItems};
  `,
    sale: {
        fontSize: "12px",
        color: "#ccc",
        textDecoration: "line-through",
        textDecorationColor: "#ccc"
    }
}
export default mixIn;
