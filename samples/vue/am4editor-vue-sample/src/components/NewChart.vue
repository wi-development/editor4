<template>
  <div class="new-chart">
    <div class="page-intro">
      <h1>Create a brand new chart</h1>
      <p>
        Create a brand new chart from standard (included) templates.
      </p>
    </div>
    <div class="chartdiv" ref="chartdiv" :style="{ backgroundColor: previewBackgroundColor }">
      <div class="placeholder" @click="launchEditor">click here to create a new chart</div>
    </div>
    <div class="comments">
      <h2>Comments</h2>
      <p>Built-in (bundled) templates are disabled by default so the user doesn't get access 
        to them by simply refreshing the browser window (when used with 'window' target type).
        To enable built-in (bundled) templates set <code>editorConfig.allowDefaultTemplates = true</code> in the launcher configuration.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// import amCharts
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as am4charts from '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/charts'; // "hack" to prevent charts from being optimized-out as unused
// import themes
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

// import Editor Launcher
import * as am4editor from '@amcharts/editor4';

@Component
export default class NewChart extends Vue {
  chart?: am4core.Sprite;
  launcher?: am4editor.EditorLauncher;
  previewBackgroundColor = 'white';

  @Prop() launcherSettings!: am4editor.ILauncherConfig;
  @Prop() editorConfig!: am4editor.IConfig;

  launchEditor() {
    this.launcher = new am4editor.EditorLauncher(this.launcherSettings);
    
    this.launcher.addEventListener('save', this.renderChart);
    this.launcher.addEventListener('close', () => { 
      if (this.launcher) {
        this.launcher.close(); 
      }
    });

    // create a copy of global editor config so we don't modify it everywhere
    const editorConfig: am4editor.IConfig = JSON.parse(JSON.stringify(this.editorConfig));
    editorConfig.allowDefaultTemplates = true;
    this.launcher.editorConfig = editorConfig;

    this.launcher.launch();
  }

  renderChart(event?: am4editor.ILauncherEventArguments) {
    if (event) {
      if (this.launcher) {
        this.launcher.close();
      }

      if (event.appliedThemes) {
        this.applyChartThemes(event.appliedThemes);
      }

      if (this.chart !== undefined) {
        this.chart.dispose();
      }

      this.chart = am4core.createFromConfig(event.chartConfig, this.$refs.chartdiv as HTMLElement);
    }
  }

  applyChartThemes(themes: string[]) {
    am4core.unuseAllThemes();

    // just a sampling of applying a couple of themes
    if (themes) {
      themes.forEach(t => {
        switch (t) {
          case 'am4themes_animated': {
            am4core.useTheme(am4themes_animated);
            break;
          }
          case 'am4themes_dark': {
            am4core.useTheme(am4themes_dark);
            break;
          }
        }
      });
    }

    // get background color from applied themes
    const interfaceColors = new am4core.InterfaceColorSet();
    this.previewBackgroundColor = interfaceColors.getFor('background').hex;
  }

  beforeDestroy() {
    if (this.chart !== undefined) {
      // cleanup after ourselves
      this.chart.dispose();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
