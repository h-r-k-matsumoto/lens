/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import type { Pod, Container } from "../../../../common/k8s-api/endpoints";
import { Renderer } from "../../../../extensions/extension-api";

const {
  Component: {
    logTabStore,
  },
  Navigation,
} = Renderer;

export type PodLogs = (object: Pod, container?: Container) => void;

const podLogsInjectable = getInjectable({
  id: "pod-logs",
  instantiate: (): PodLogs => {
    return (pod, container) => {
      Navigation.hideDetails();
      let c = container;
      if (!c){
        c = pod.getContainers()[0];
      }
      logTabStore.createPodTab({
        selectedPod: pod,
        selectedContainer: c,
      });
    }
  },
});

export default podLogsInjectable;
