import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, IDetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import {PrimaryButton, DefaultButton} from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, DropdownMenuItemType, IDropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { createRef } from 'office-ui-fabric-react/lib/Utilities';
import { DatePicker, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';


let _items: any[] = [];

const DayPickerStrings: IDatePickerStrings = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  // prevMonthAriaLabel: 'Go to previous month',
  // nextMonthAriaLabel: 'Go to next month',
  // prevYearAriaLabel: 'Go to previous year',
  // nextYearAriaLabel: 'Go to next year',
  // closeButtonAriaLabel: 'Close date picker'
};

const _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Name',
    fieldName: 'name',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Value',
    fieldName: 'value',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column3',
    name: 'Mult',
    fieldName: 'mult',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for multiplication'
  },
  {
    key: 'column4',
    name: 'EditButton',
    fieldName: 'editbutton',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for Edit Button'
  }
];

export class App extends React.Component<
  {},
  {
    showPanel : boolean;
    items: {}[];
    selectionDetails: {};
    showItemIndexInView: boolean;
    name : string,
    value : number,
    mult : number,
    selectedDropDown : string,
    selectedChoiceGroup : string,
    selectedKey: number
  }
> {
  private _selection: Selection;
  private _detailsList = React.createRef<IDetailsList>();
  private _basicDropdown = createRef<IDropdown>();

  constructor(props: {}) {
    super(props);

    // Populate with items for demos.
    if (_items.length === 0) {
      for (let i = 0; i < 10; i++) {
        _items.push({
          key: i,
          name: 'Item ' + i,
          value: i,
          mult : i*3,
          editbutton : <PrimaryButton
          data-automation-id="test"
          text="Open Panel"
          onClick={this._onShowPanel}
          allowDisabledFocus={true}
        />
        });
      }
    }

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this.state = {
      items: _items,
      selectionDetails: this._getSelectionDetails(),
      showItemIndexInView: false,
      showPanel : false,
      name : '',
      mult : 0,
      value : 0,
      selectedDropDown : '',
      selectedChoiceGroup : '',
      selectedKey: 0
    };
  }

  public render(): JSX.Element {
    const { items, selectionDetails } = this.state;

    return (
      <div>
        <div>{selectionDetails}</div>
        {/* <div>
          <Checkbox
            label="Show index of the first item in view when unmounting"
            checked={this.state.showItemIndexInView}
            onChange={this._onShowItemIndexInViewChanged}
          />
        </div> */}
        <TextField label="Filter by name:" onChange={this._onChange} />
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            componentRef={this._detailsList}
            items={items}
            columns={_columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            onItemInvoked={this._onItemInvoked}
          />
        </MarqueeSelection>
        <div>
        <PrimaryButton
          data-automation-id="delete"
          text="Delete"
          onClick={this.OnDeleteClick}
          allowDisabledFocus={true}
        />
        </div>
        <Panel
          isOpen={this.state.showPanel}
          type={PanelType.smallFixedFar}
          onDismiss={this._onClosePanel}
          headerText="Panel - Small, right-aligned, fixed, with footer"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={this._onRenderFooterContent}
        >
          <ChoiceGroup
            options={[
              {
                key: 'A',
                text: this.state.name
              },
              {
                key: 'B',
                text: this.state.mult.toString(),
                checked: true
              },
              {
                key: 'C',
                text: this.state.value.toString(),
              }
            ]}
            label="Pick one"
            required={true}
            onChange={this.ChosenOption}
          />

          {/* Dropdown Section */}

          <Dropdown
          placeHolder="Select an Option"
          label="Basic uncontrolled example:"
          id="Basicdrop1"
          ariaLabel="Basic dropdown example"
          options={[
            { key: 'Header', text: 'Actions', itemType: DropdownMenuItemType.Header },
            { key: 'A', text: this.state.name },
            { key: 'B', text: this.state.mult.toString() },
            { key: 'C', text: this.state.value.toString() },
          ]}
          // onFocus={this._log('onFocus called')}
          // onBlur={this._log('onBlur called')}
          componentRef={this._basicDropdown}
          onChange={this.ChosenDropdown}
        />

          {/* Date picker */}
          
          <DatePicker
          strings={DayPickerStrings}
          placeholder="Select a date..."
          ariaLabel="Select a date"
          // tslint:disable:jsx-no-lambda
          onAfterMenuDismiss={() => console.log('onAfterMenuDismiss called')}
          // tslint:enable:jsx-no-lambda
        />
        </Panel>
      </div>
    );
  }

  public componentWillUnmount() {
    if (this.state.showItemIndexInView) {
      const itemIndexInView = this._detailsList!.current!.getStartItemIndexInView();
      alert('unmounting, getting first item index that was in view: ' + itemIndexInView);
    }
  }

  public ChosenOption = (event: React.FormEvent<HTMLElement | HTMLInputElement>, namevalue: IChoiceGroupOption ): void =>{
    this.setState({
       selectedChoiceGroup: namevalue.text
    })
  }

  public ChosenDropdown = (event: React.FormEvent<HTMLDivElement>, namevalue: IDropdownOption ): void =>{
    this.setState({
      selectedDropDown : namevalue.text
    })
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({ items: text ? _items.filter(i => i.name.toLowerCase().indexOf(text) > -1) : _items });
  };

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  // -----------------------------------------------------------------------------------------------------------

  public OnDeleteClick = (): void=>{
    
    // const selectionCount = this._selection.getSelectedCount();

    // let newArray = this.state.items;

    // for (let i = 0; i < selectionCount; i++) {
    //   let keyToBeRemoved = (this._selection.getSelection()[i] as any);
    //   let filteredItem = newArray.filter(item => item !== keyToBeRemoved);
    //   console.log(filteredItem);
    //   newArray = filteredItem;
    // }
    // this.setState({ items: newArray })
    // _items = newArray

    let selectedItems = (this._selection.getSelection() as {}[]);
    this.setState({
      items: this.state.items.filter(
        item=>!selectedItems.includes(item)
          //using some
          // !selectedItems.some(
          //   selected=>
          //     selected===item
          // )
      ) 
    })
    _items = this.state.items.filter(item=>!selectedItems.includes(item));

    // let selectedItems = (this._selection.getSelection() as {}[]);
    // let itemsCopy = this.state.items;
    // let newArray = itemsCopy.filter(item => selectedItems.indexOf(item) < 0);
    // this.setState({ items: newArray });
    // _items = newArray;
  }

  //-------------------------------------------------------------------------------------------------------------
  private _onClosePanel = (): void => {
    this.setState({ showPanel: false });
  };

  private _onSaveClick = () : void => {

    // _items.map((value)=>{
    //   if (value.key == this.state.selectedKey){
    //     value.name = this.state.value
    //   }
    // })
    // console.log(_items);
    // this.forceUpdate();

    alert("Selected Choicegroup is : " + this.state.selectedChoiceGroup +"\n"+ "Selected Dropdown option is: "+ this.state.selectedDropDown);

  }

  private _onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={this._onSaveClick} style={{ marginRight: '8px' }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={this._onClosePanel}>Cancel</DefaultButton>
      </div>
    );
  };

  private _onShowPanel = (): void => {
    
    //this.setState({ showPanel: true });
    const selectedKey = (this._selection.getSelection()[0] as any).key;
    _items.forEach((value)=>{
      if(value.key === selectedKey){
        this.setState({
          showPanel : true,
          name : value.name,
          mult : value.mult,
          value : value.value,
          selectedKey: value.key
        }) 
      }
    })
  };
}

export default App;