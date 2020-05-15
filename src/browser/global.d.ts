import {
  CreateNodecgInstance,
  CreateNodecgConstructor
} from 'ts-nodecg/browser';
import { Configschema } from '../nodecg/generated/configschema';
import { ReplicantMap } from '../nodecg/replicants';
import { SpeedcontrolReplicantMap } from '../nodecg/speedcontrol';
import { MessageMap } from '../nodecg/messages';

type SpeedcontrolInstance = CreateNodecgInstance<
  'nodecg-speedcontrol',
  {},
  SpeedcontrolReplicantMap,
  {},
  true
>

type SpeedcontrolConstructor = CreateNodecgConstructor<
  'nodecg-speedcontrol',
  {},
  SpeedcontrolReplicantMap,
  {},
  true
>

declare global {
    const nodecg: CreateNodecgInstance<
      'ome-speedrun-layout',
      Configschema,
      ReplicantMap,
      MessageMap
    > & SpeedcontrolInstance;
    const NodeCG: CreateNodecgConstructor<
      'ome-speedrun-lalyout',
      Configschema,
      ReplicantMap,
      MessageMap
    > & SpeedcontrolConstructor;
}