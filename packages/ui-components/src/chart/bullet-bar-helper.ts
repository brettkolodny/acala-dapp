import * as d3 from 'd3';
import { debounce } from 'lodash';

type AnySelection = d3.Selection<any, any, any, any>;

type AttrParams = Record<string, any>;

export const mapAttr = (section: AnySelection, attr: AttrParams): AnySelection => {
  Object.keys(attr).forEach((key: string): void => {
    section.attr(key, attr[key]);
  });

  return section;
};

export interface BulletBarConfigItem {
  label: string;
  labelStatus?: string;
  data: number;
  color: string;
  dataTransfer?: (data: number) => string;
}

export class BulletBarDrawer {
  private $el: HTMLElement;
  private $container: AnySelection;
  private $canvas!: AnySelection;
  private $background!: AnySelection;
  private canvasHeight: number;

  constructor ($el: HTMLElement) {
    this.$el = $el;
    this.$container = d3.select(this.$el);
    this.canvasHeight = 42;
  }

  private adjustTextPosition (config: BulletBarConfigItem[]): void {
    const canvasBox = this.$background.node().getBBox();

    config.forEach((_item: BulletBarConfigItem, index: number): void => {
      const current = this.$canvas.select<SVGTextElement>(`#text-${index}`);
      const next = this.$canvas.select<SVGTextElement>(`#text-${index + 1}`);
      const currentNode = current.node();
      const nextNode = next.node();

      if (!currentNode) return;

      const currentBox = currentNode.getBBox();

      if (currentBox.x <= 0) {
        current.attr('x', currentBox.width / 2);

        return;
      }

      if (canvasBox.width - currentBox.x - currentBox.width / 2 <= 0) {
        current.attr('x', canvasBox.width - currentBox.width / 2);

        return;
      }

      // adjust edge
      if (!nextNode) return;
      const nextBox = nextNode.getBBox();

      // adjust overlap
      if (currentBox.x < nextBox.x + nextBox.width) {
        next.attr('x', currentBox.x - nextBox.width / 2 - 10);
      }
    });
  }

  private getBarWidth (data: number, scale: d3.ScaleLinear<number, number>): number {
    const canvasBox = this.$background.node().getBBox();
    const barMaxWidth = canvasBox.width;

    if (data === Infinity) {
      return barMaxWidth;
    }

    if (Number.isNaN(data)) {
      return 0;
    }

    return scale(data) || 0;
  }

  public create (config: BulletBarConfigItem[]): void {
    // create d3 canvas
    this.$canvas = mapAttr(this.$container.append('svg'), {
      fill: 'transparent',
      height: this.canvasHeight,
      width: '100%'
    });

    this.$background = mapAttr(this.$canvas.append('rect'), {
      fill: 'transparent',
      height: '100%',
      width: '100%'
    });

    const canvasBox = this.$background.node().getBBox();
    const barHeight = 6;
    const barX = 0;
    const barY = 36;
    const barMaxWidth = canvasBox.width;

    mapAttr(this.$canvas.append('rect'), {
      class: 'basic-bar',
      fill: '#ffffff',
      height: barHeight,
      rx: barHeight / 2,
      ry: barHeight / 2,
      width: barMaxWidth,
      x: barX,
      y: barY
    });

    const _sortedConfig = config
      .slice()
      .sort((a: BulletBarConfigItem, b: BulletBarConfigItem): number => b.data - a.data);

    this.$canvas.selectAll('.bar').data(_sortedConfig)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('height', barHeight)
      .attr('rx', barHeight / 2)
      .attr('ry', barHeight / 2)
      .attr('x', barX)
      .attr('y', barY);

    this.$canvas.selectAll('.end')
      .data(_sortedConfig)
      .enter()
      .append('rect')
      .attr('class', 'end')
      .attr('height', barHeight)
      .attr('width', barHeight)
      .attr('y', barY);

    this.$canvas.selectAll('.label')
      .data(_sortedConfig)
      .enter()
      .append('text')
      .attr('font-size', 20)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('y', 20)
      .attr('class', 'label');

    this.$canvas.selectAll('.poly-line')
      .remove()
      .exit()
      .data(_sortedConfig)
      .enter()
      .append('polyline')
      .attr('class', 'poly-line');
  }

  public update = debounce((config: BulletBarConfigItem[]): void => {
    const canvasBox = this.$background.node().getBBox();
    const maxInputData = Math.min(
      Math.max.apply(
        undefined,
        config.map((item) => item.data)
      ),
      10 ** 9
    );
    const barHeight = 6;
    const barX = 0;
    const barY = 36;
    const minBarWidth = 6;

    const scale = d3
      .scaleLinear()
      .domain([0, maxInputData * 1.5])
      .range([0, canvasBox.width]);

    const _sortedConfig = config
      .slice()
      .sort((a: BulletBarConfigItem, b: BulletBarConfigItem): number => b.data - a.data);

    this.$canvas.selectAll('.label')
      .data(_sortedConfig)
      .attr('id', (_item, index) => `text-${index}`)
      .attr('fill', (item) => item.color)
      .text((item) => item.dataTransfer ? item.dataTransfer(item.data) : item.data)
      .attr('x', (item) => this.getBarWidth(item.data, scale) + barX);

    this.adjustTextPosition(_sortedConfig);

    this.$canvas.selectAll('.poly-line')
      .data(_sortedConfig)
      .attr('fill', 'none')
      .attr('points', (item, index): any => {
        const text = this.$canvas.select<SVGTextElement>(`#text-${index}`);
        const textNode = text.node();

        if (!textNode) return [];

        const textBox = textNode.getBBox();
        const barX2 = barX + this.getBarWidth(item.data, scale);
        const pointAtBarEndX = Math.max(barX2 - 0.5, minBarWidth);

        if (index === 0 || textBox.x + textBox.width - barX2 > 0) {
          return [
            pointAtBarEndX,
            barY - barHeight, // point 3
            pointAtBarEndX,
            barY // point 4
          ];
        } else {
          return [
            textBox.x,
            textBox.y + textBox.height, // point 1
            textBox.x + textBox.width,
            textBox.y + textBox.height, // point 2
            pointAtBarEndX,
            barY - barHeight, // point 3
            pointAtBarEndX,
            barY // point 4
          ];
        }
      })
      .attr('stroke-width', 1)
      .attr('stroke', (item) => item.color);

    this.$canvas.selectAll('.bar').data(_sortedConfig)
      .attr('fill', (item) => item.color)
      .transition()
      .duration(400)
      .attr('width', (item) => this.getBarWidth(item.data, scale));

    this.$canvas.selectAll('.end').data(_sortedConfig)
      .attr('fill', (item) => item.color)
      .transition()
      .duration(400)
      .attr('x', (item) => Math.max(this.getBarWidth(item.data, scale) - barHeight + barX, 0));
  }, 300)
}
