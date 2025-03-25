import { useParams } from "react-router-dom";
import type { ComponentType } from "react";

type ParamsProps = {
  params: ReturnType<typeof useParams>;
};

const withParams = <P extends object>(
  Component: ComponentType<P & ParamsProps>
) => {
  return (props: P) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
};

export default withParams;
