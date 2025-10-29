import React, { SFC, useCallback, useEffect, useState } from "react";
import { useServerState } from "../../hooks/useServerState";

import "./style.scss";

export interface ToggleState {
  text: string;
  active?: boolean;
}

export interface ToggleProps {
  states: ToggleState[];
  className?: string;
  id?: string;
  onRendered?: () => void;
  onClick?: () => void;
}

const Toggle: SFC<ToggleProps> = (props) => {
  const { className, states, onRendered, id } = props;
  const css = ["__toggle__", className ? className : null].join(" ").trim();

  // find the active state
  const state = states.find((element) => element.active === true);
  const text = (state && state.text) || "";

  // set the new active one
  const [active, setActive] = useState(state);

  // Handle incoming state updates from server
  const handleServerStateUpdate = useCallback(
    (fullState: Record<string, any>) => {
      if (id && fullState[`toggle_${id}`]) {
        const update = fullState[`toggle_${id}`];
        const newIndex = update.activeIndex;

        console.log(
          `Received update for toggle ${id}, setting to index ${newIndex}`,
        );

        // Update the states array
        states.forEach((element) => (element.active = false));
        if (states[newIndex]) {
          states[newIndex].active = true;
          setActive(states[newIndex]);
        }
      }
    },
    [id, states],
  );

  const { updateState } = useServerState({
    onStateUpdate: handleServerStateUpdate,
  });

  // events
  const handleRendered = () => onRendered && onRendered();
  const handleClick = useCallback(() => {
    console.log(`click on ${text}`, id);
    console.log(active);

    if (active) {
      // get the active index;
      const index = states.findIndex((element) => element === active);
      // unset everything
      states.forEach((element) => (element.active = false));
      // set the next active element
      const next = states[index + 1 === states.length ? 0 : index + 1];
      next.active = true;
      setActive(next);

      // Send state update to server
      if (id) {
        updateState({
          [`toggle_${id}`]: {
            activeIndex: index + 1 === states.length ? 0 : index + 1,
            text: next.text,
            timestamp: Date.now(),
          },
        });
      }
    }
  }, [states, active, setActive, id, updateState, text]);

  // this should fire on mount/update
  useEffect(() => handleRendered());

  return (
    <div className={css} onClick={handleClick}>
      {text}
    </div>
  );
};

export default Toggle;
