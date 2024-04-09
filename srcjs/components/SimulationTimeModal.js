import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// Table
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
// Utils
import { splitSimulationTimeToArray, simulationTimeToString } from '../utils/simulationTimeModal';

// register Handsontable's modules
registerAllModules();

function SimulationTimeModal({showModal, onCloseModal, onDataSubmit, cellData}) {
    const [formData, setFormData] = useState('');
    const hotRef = useRef(null);

    const handleSubmit = () => {
      // Assuming formData is validated
      const hot = hotRef.current.props.data;
      // setFormData(simulationTimeToString(hot));
      const simulationVal = simulationTimeToString(hot)

      onDataSubmit(simulationVal, cellData.col_name, cellData.row_num, cellData.cell_value);
      onCloseModal();
    };

  return (
    <React.Fragment>
      <Dialog
        // fullWidth={true}
        // maxWidth={maxWidth}
        open={showModal}
        onClose={onCloseModal}
      >
        <DialogTitle>Enter Simulation Time</DialogTitle>
        <DialogContent style={{height: '25vh'}}>

        <div>
            <HotTable
                id="hot2"
                ref={hotRef}
                data={splitSimulationTimeToArray(cellData.cell_value, 3)}
                rowHeaders={true}
                colHeaders={['Start', 'End', 'Points']}
                autoWrapRow={true}
                autoWrapCol={true}
                columns={[
                  {type: 'numeric'},
                  {type: 'numeric'},
                  {type: 'numeric'}
                ]}
                contextMenu={{
                    items: {
                        'cut': {
                          name: 'Clear'
                        },
                        'row_below': {},
                        'remove_row': {
                            disabled() {
                                // Disable option when first row was clicked
                                return this.getSelectedLast()[0] === 0; // `this` === hot
                            }
                        }
                    }
                }}
                licenseKey="non-commercial-and-evaluation"
            />
        </div>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SimulationTimeModal;
