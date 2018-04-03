const extractBaseElement = (Component) => {
  const injected = new Component();

  // eslint-disable-next-line
  return injected.render().type;
};

export default extractBaseElement;
