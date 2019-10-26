import React from 'react';
import { ITimerList } from '../data/schema';
import Timer from './Timer';

export default function ListTimers(props:ITimerList){
  let { filtered, handleChange, deleteItem, viewSlim, openDialog } = props;
  if(viewSlim){
    return(
      <div className="flex">
        {filtered.map((item) => {
          return(
          <div key={item.id}>
            <Timer data={item} viewSlim={viewSlim} handleChange={handleChange} info={openDialog} />
          </div>
        );
        })}
      </div>
    );
  } else {
    return(
      <div className="flex">
        {filtered.map((item) => {
          return(
          <div key={item.id}>
            <Timer data={item} viewSlim={viewSlim} handleChange={handleChange} delete={deleteItem} />
          </div>
        );
        })}
      </div>
    );
  }
}