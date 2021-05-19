import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { styles } from "./styles";
import { Text } from "./components/text";

export default extendTheme({
  colors,
  styles,
  components: {
    Text,
  },
});
