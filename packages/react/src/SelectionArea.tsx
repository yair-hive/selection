/* eslint-disable no-use-before-define */
import VanillaSelectionArea from '@viselect/vanilla';
import {SelectionEvents, SelectionOptions} from '@viselect/vanilla';
import React, {createRef, useEffect, createContext, useContext, useState} from 'react';

export interface SelectionAreaProps extends Omit<Partial<SelectionOptions>, 'boundaries'>, React.HTMLAttributes<HTMLDivElement> {
    id?: string;
    className?: string;
    onBeforeStart?: SelectionEvents['beforestart'];
    onBeforeDrag?: SelectionEvents['beforedrag'];
    onStart?: SelectionEvents['start'];
    onMove?: SelectionEvents['move'];
    onStop?: SelectionEvents['stop'];
}

const SelectionContext = createContext<Object | undefined>(undefined);

export function useSelection(){
    return useContext(SelectionContext)
}

export const SelectionArea: React.FunctionComponent<SelectionAreaProps> = props => {
    
    const root = createRef<HTMLDivElement>();
    const [selectionState, setSelection] = useState<Object | undefined>(undefined)

    useEffect(() => {
        const {onBeforeStart, onBeforeDrag, onStart, onMove, onStop, ...opt} = props;
        const areaBoundaries = root.current as HTMLElement;

        const selection = new VanillaSelectionArea({
            boundaries: areaBoundaries,
            ...opt
        });

        onBeforeStart && selection.on('beforestart', onBeforeStart);
        onBeforeDrag && selection.on('beforedrag', onBeforeDrag);
        onStart && selection.on('start', onStart);
        onMove && selection.on('move', onMove);
        onStop && selection.on('stop', onStop);

        setSelection(selection)

        return () => selection.destroy();
    }, []);

    return (
        <SelectionContext.Provider value={selectionState}>
            <div ref={root} className={props.className} id={props.id}>
                {props.children}
            </div>
        </SelectionContext.Provider>
    );
};
