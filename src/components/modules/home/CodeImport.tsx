import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import CodeEditor from '../../core/CodeEditor';
import { Button } from '@blueprintjs/core';
import { StyleClass, css } from '../../../utils/Style';

const codeImportStyle = new StyleClass(css`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`);

const importButtoRowStyle = new StyleClass(css`
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`);

interface ICodeImportProps {
  onChartImport: (config: object) => void;
}

@observer
class CodeImport extends Component<ICodeImportProps> {
  @observable private codeToImport = '';

  public constructor(props: Readonly<ICodeImportProps>) {
    super(props);

    this.handleImportClick = this.handleImportClick.bind(this);
  }

  render() {
    return (
      <div className={codeImportStyle.className}>
        <p>
          Paste JSON chart config or JavaScript code created with this Editor in
          the field below and press "Import."
        </p>
        <CodeEditor
          mode="javascript"
          value={this.codeToImport}
          readOnly={false}
          onValueChange={newVale => (this.codeToImport = newVale)}
        />
        <div className={importButtoRowStyle.className}>
          <Button
            icon="import"
            text="Import..."
            onClick={this.handleImportClick}
          />
        </div>
      </div>
    );
  }

  private async handleImportClick() {
    // @todo: import from object-style code special tag
    if (this.codeToImport !== '') {
      let jsonConfig: object | undefined = undefined;
      try {
        jsonConfig = JSON.parse(this.codeToImport);
      } catch {
        // @todo: handle error
      }
      if (jsonConfig !== undefined && this.props.onChartImport) {
        this.props.onChartImport(jsonConfig);
      }
    }
  }
}

export default CodeImport;