import { Suspense, type ComponentType } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const withSuspense = (Component: ComponentType) => {
  return () => (
    <Suspense
      fallback={
        <Spin
          className={`flex justify-center h-screen w-screen items-center mt-5`}
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        />
      }
    >
      <Component />
    </Suspense>
  );
};

export default withSuspense;
