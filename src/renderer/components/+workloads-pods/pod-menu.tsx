/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import React from "react";
import { withInjectables } from "@ogre-tools/injectable-react";

import type { KubeObjectMenuProps } from "../kube-object-menu";
import type { Pod } from "../../../common/k8s-api/endpoints";
import { prevDefault } from "../../utils";
import { MenuItem,SubMenu } from "../menu";
import { StatusBrick } from "../status-brick";
import { Icon } from "../icon";
import PodShellInjectable from "./menu/pod-shell.injectable";
import PodLogsInjectable from "./menu/pod-logs.injectable";
import type { PodShell } from "./menu/pod-shell.injectable";
import type { PodLogs } from "./menu/pod-logs.injectable";

export interface PodMenuProps extends KubeObjectMenuProps<Pod> {}

interface Dependencies {
  podShell: PodShell;
  podLogs: PodLogs;
}

const NonInjectedPodMenu = ({
  podShell, 
  podLogs,
  object,
  toolbar,
}: Dependencies & PodMenuProps) => (
  <>
    <MenuItem onClick={prevDefault(() => podShell(object))}>
      <Icon
            svg="ssh"
            interactive={toolbar}
            tooltip={toolbar && "Pod Shell"} 
      />
      <span className="title">Shell</span>
      {object.getRunningContainers().length > 1 && (
          <>
            <Icon className="arrow" material="keyboard_arrow_right"/>
            <SubMenu>
              {
                object.getRunningContainers().map(container => {
                  const { name } = container;
                  return (
                    <MenuItem
                      key={name}
                      onClick={prevDefault(() =>podShell(object, name))}
                      className="flex align-center"
                    >
                      <StatusBrick/>
                      <span>{name}</span>
                    </MenuItem>
                  );
                })
              }
            </SubMenu>
          </>
        )}
    </MenuItem>
    <MenuItem onClick={prevDefault(() => podLogs(object))}>
        <Icon
          material="subject"
          interactive={toolbar}
          tooltip={toolbar && "Pod Logs"}
        />
        <span className="title">Logs</span>
        {
          object.getRunningContainers().length > 1 && (
          <>
            <Icon className="arrow" material="keyboard_arrow_right"/>
            <SubMenu>
              { 
                object.getRunningContainers().map(container => {
                  const { name } = container;

                  return (
                    <MenuItem
                      key={name}
                      onClick={prevDefault(() => podLogs(object, container))}
                      className="flex align-center"
                    >
                      <StatusBrick/>
                      <span>{name}</span>
                    </MenuItem>
                  );
                })
              }
            </SubMenu>
          </>
        )} 
    </MenuItem>
  </>
);

export const PodMenu = withInjectables<Dependencies, PodMenuProps>(NonInjectedPodMenu, {
  getProps: (di, props) => ({
    ...props,
    podShell: di.inject(PodShellInjectable),
    podLogs: di.inject(PodLogsInjectable),
  }),
});
