import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  colors: {
    bball: {
      main: "#6B46C1",
      main_light: "#805AD5",
      background: "#1a202c",
      background_light: "#011627",
    },
  },
  styles: {
    global: {
      body: {
        color: "white",
      },
    },
  },
  components: {
    Table: {
      variants: {
        dark: {
          bg: "red",
          th: {
            color: "gray.400",
            borderBottom: "1px",
            borderColor: "gray.800",
          },
          td: {
            color: "white",
            fontWeight: "bold",
            borderBottom: "1px",
            borderColor: "gray.800",
          },
        },
      },
      defaultProps: {
        size: "sm",
        variant: "dark",
      },
    },
    Text: {
      baseStyle: {
        fontWeight: "bold",
      },
    },

    // Table: {
    //   baseStyle: {
    //     color: "blue",
    //     bg: "white",
    //   },
    // },
    // Td: {
    //   baseStyle: {
    //     color: "yellow",
    //     bg: "green",
    //   },
    // },
  },
});
