/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Pod } from "../../../../common/k8s-api/endpoints";
import { Renderer,Common } from "../../../../extensions/extension-api";

const {
  Component: {
    createTerminalTab,
    terminalStore,
  },
  Navigation, 
} = Renderer;
const {
  App,
} = Common;

export type PodShell = (object: Pod, container?: string) => void;

const podShellInjectable= getInjectable({
  id: "pod-shell",
  instantiate: (): PodShell => {
    return (pod, container) => {
      const kubectlPath = App.Preferences.getKubectlPath() || "kubectl";
      const commandParts = [
        kubectlPath,
        "exec",
        "-i",
        "-t",
        "-n", pod.getNs(),
        pod.getName(),
      ];
      if (container) {
        commandParts.push("-c", container);
      } 
      commandParts.push("-- sh");

      const shell = createTerminalTab({
        title: `${pod.getName()} (namespace: ${pod.getNs()})`,
      });

      terminalStore.sendCommand(commandParts.join(" "), {
        enter: true,
        tabId: shell.id,
      });

      Navigation.hideDetails();
   }
  },
});

export default podShellInjectable;
