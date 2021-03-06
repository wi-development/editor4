import React, { Component } from 'react';
import { observer } from 'mobx-react';

import {
  Text,
  Button,
  Popover,
  Intent,
  Collapse,
  Icon
} from '@blueprintjs/core';

import Property from '../../../classes/Property';

import editorTheme from './../../../themes/editor/EditorTheme';
import { StyleClass, css } from '../../../utils/Style';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import IPropertyEditorProps from './IPropertyEditorProps';
import IValueType from '../../../classes/IValueType';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import TypeSelectionMenu from './TypeSelectionMenu';

const propertyEditorListStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListLabelStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${editorTheme.propertyPanelGridColor};
  padding: 0px 0.3em 0px 1em;
`);

const propertyEditorListItemListStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: column;
`);

const propertyEditorListItemRowStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-bottom: 1px solid transparent;
  padding-right: 0.3em;
  background-color: ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListItemObjectStyle = new StyleClass(css`
  flex-grow: 2;
  overflow: hidden;
  display: flex;
  padding: 10px 0.3em 10px 1em;
  cursor: pointer;
`);
const propertyEditorListItemObjectButtonStyle = new StyleClass(css`
  color: ${editorTheme.propertyPanelAccentColor};
`);

const propertyEditorListActionRowStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0px;
`);

const propertyEditorListItemActionBoxStyle = new StyleClass(css`
  padding: 10px 0px;
`);

const editorLabelTextStyle = new StyleClass(css`
  display: flex;
  cursor: pointer;
`);

const editorLabelIconStyle = new StyleClass(css`
  margin-right: 10px;
`);

const editorListItemIconStyle = new StyleClass(css`
  margin-right: 10px;
`);

@observer
class ListPropertyPanel extends Component<IPropertyEditorProps> {
  //@observable private isOpen = false;

  public constructor(props: Readonly<IPropertyEditorProps>) {
    super(props);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.handleRemoveListItemClick = this.handleRemoveListItemClick.bind(this);
    this.handleAddItemClick = this.handleAddItemClick.bind(this);
  }

  public render() {
    const p = this.props.property;
    const values = p.value !== undefined ? (p.value as Property[]) : [];

    return (
      <div key={p.name} className={propertyEditorListStyle.className}>
        <div className={propertyEditorListLabelStyle.className}>
          <div
            className={editorLabelTextStyle.className}
            onClick={() => {
              if (this.props.onExpandedChange !== undefined) {
                this.props.onExpandedChange(p.name);
              }
            }}
          >
            <Icon
              icon={this.props.isExpanded ? 'caret-down' : 'caret-right'}
              className={editorLabelIconStyle.className}
            />
            <Text ellipsize={true}>
              {PropertyEditorHelpers.getDisplayName(p)}
            </Text>
          </div>
          <div className={propertyEditorListActionRowStyle.className}>
            {p.editorType.indexOf('Template') > 0 && (
              <div>{this.getTemplateButton(p)}</div>
            )}
            <div>
              {p.valueTypes &&
                p.valueTypes.length > 0 &&
                p.valueTypes[0].subTypes &&
                p.valueTypes[0].subTypes.length > 1 && (
                  <Popover
                    position="auto"
                    minimal={true}
                    content={
                      <TypeSelectionMenu
                        property={p}
                        forTemplate={false}
                        onItemClick={this.handleAddItemClick}
                      />
                    }
                  >
                    <Button
                      small={true}
                      minimal={true}
                      icon="plus"
                      title="add"
                      intent={Intent.SUCCESS}
                    />
                  </Popover>
                )}
              {p.valueTypes &&
                p.valueTypes.length > 0 &&
                p.valueTypes[0].subTypes &&
                p.valueTypes[0].subTypes.length === 1 && (
                  <Button
                    small={true}
                    minimal={true}
                    icon="plus"
                    title="add"
                    intent={Intent.SUCCESS}
                    onClick={() =>
                      this.handleAddItemClick(
                        p,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        p.valueTypes![0].subTypes![0]
                      )
                    }
                  />
                )}
            </div>
          </div>
        </div>
        <Collapse isOpen={this.props.isExpanded}>
          <div className={propertyEditorListItemListStyle.className}>
            {values.map((listItem, index) => (
              <div
                key={p.name + '_' + index}
                className={propertyEditorListItemRowStyle.className}
              >
                <div
                  className={propertyEditorListItemObjectStyle.className}
                  title={PropertyEditorHelpers.getDisplayString(listItem)}
                  onClick={event => {
                    this.handleListItemClick(listItem, p);
                  }}
                >
                  <Icon
                    icon="drag-handle-vertical"
                    className={editorListItemIconStyle.className}
                  />
                  <Text
                    ellipsize={true}
                    className={
                      propertyEditorListItemObjectButtonStyle.className
                    }
                  >
                    {PropertyEditorHelpers.getDisplayString(listItem)}
                  </Text>
                </div>
                <div className={propertyEditorListItemActionBoxStyle.className}>
                  <Popover
                    content={
                      <DeleteConfirmationDialog
                        onDeleteClick={() =>
                          this.handleRemoveListItemClick(p, listItem)
                        }
                      />
                    }
                  >
                    <Button
                      small={true}
                      minimal={true}
                      icon="cross"
                      intent={Intent.NONE}
                    />
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  private handleRemoveListItemClick(p: Property, listItem: Property) {
    if (this.props.onRemoveListItem) {
      this.props.onRemoveListItem(p, listItem);
    }
  }

  private handleListItemClick(property: Property, listProperty: Property) {
    if (this.props.onCurrentPropertyChange) {
      this.props.onCurrentPropertyChange(property, listProperty);
    }
  }

  private handleAddItemClick(
    p: Property,
    itemType: IValueType,
    forTemplate?: boolean
  ) {
    if (this.props.onAddListItem !== undefined) {
      if (forTemplate) {
        this.props.onAddListItem(p, itemType, true);
        const templateProperty = p.properties
          ? p.properties.find(tp => tp.name === 'template')
          : undefined;
        if (templateProperty && templateProperty.value !== undefined) {
          this.handleListItemClick(templateProperty.value, p);
        }
      } else {
        this.props.onAddListItem(p, itemType);
        const currentList = p.value as Property[];
        if (currentList && currentList.length > 0) {
          this.handleListItemClick(currentList[currentList.length - 1], p);
        }
      }
    }
  }

  // @todo: extract to a separate component as it's redundant between template/list
  private getTemplateButton(p: Property): JSX.Element {
    const templateProperty = p.properties
      ? p.properties.find(tp => tp.name === 'template')
      : undefined;

    const valueTypeCount =
      p.valueTypes && p.valueTypes.length > 0 && p.valueTypes[0].subTypes
        ? p.valueTypes[0].subTypes.length
        : -1;

    if (templateProperty && templateProperty.value !== undefined) {
      return (
        <Button
          small={true}
          minimal={true}
          rightIcon="settings"
          title="template"
          intent={Intent.NONE}
          onClick={() => this.handleListItemClick(templateProperty.value, p)}
        />
      );
    } else if (valueTypeCount > 1) {
      return (
        <Popover
          position="auto"
          minimal={true}
          content={
            <TypeSelectionMenu
              property={p}
              forTemplate={true}
              onItemClick={this.handleAddItemClick}
            />
          }
        >
          <Button
            small={true}
            minimal={true}
            icon="settings"
            title="template"
            intent="primary"
          />
        </Popover>
      );
    } else if (valueTypeCount === 1) {
      return (
        <Button
          small={true}
          minimal={true}
          icon="settings"
          title="template"
          intent="primary"
          onClick={() =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.handleAddItemClick(p, p.valueTypes![0].subTypes![0], true)
          }
        />
      );
    } else {
      return <span />;
    }
  }
}

export default ListPropertyPanel;
