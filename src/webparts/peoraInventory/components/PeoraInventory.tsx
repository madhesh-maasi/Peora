import * as React from 'react';
import { useEffect, useState } from "react";
import { IPeoraInventoryProps } from './IPeoraInventoryProps';
import Master from '../../../component/Master/master';

export let absoluteUrl;

const Peora = (props: IPeoraInventoryProps) => {

  absoluteUrl = props.absoluteUrl;

  return (
    <div>
      <Master />
    </div>
  );
}

export default Peora;
