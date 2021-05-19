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
        bg: "bball.background",
      },
    },
  },
  components: {
    Text: {
      baseStyle: {
        fontWeight: "bold",
      },
    },
  },
});
