import { Injectable } from '@angular/core';
import { ArchitectureNode } from '../../shared/models/architecture-node.model';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportAsMermaid(nodes: ArchitectureNode[]): string {
    const lines = ['graph TD'];
    for (const node of nodes) {
      const label = `${node.name}\\n${node.subtitle}`;
      lines.push(`  ${node.id}["${label}"]`);
    }
    return lines.join('\n');
  }

  async exportAsImage(_canvasEl: HTMLElement): Promise<void> {
    // TODO: implement with html2canvas once installed
    console.warn('exportAsImage not yet implemented');
  }
}
