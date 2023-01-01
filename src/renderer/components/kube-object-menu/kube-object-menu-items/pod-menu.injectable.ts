/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { KubeObjectMenuItemComponent } from "../kube-object-menu-item-injection-token";
import { kubeObjectMenuItemInjectionToken } from "../kube-object-menu-item-injection-token";
import { computed } from "mobx";
import { PodMenu } from "../../+workloads-pods/pod-menu";

const PodMenuInjectable = getInjectable({
  id: "pod-menu-kube-object-menu",

  instantiate: () => ({
    kind: "Pod",
    apiVersions: ["v1"],
    Component: PodMenu as KubeObjectMenuItemComponent,
    enabled: computed(() => true),
    orderNumber: 10,
  }),

  injectionToken: kubeObjectMenuItemInjectionToken,
});

export default PodMenuInjectable;
