import * as d3 from "d3";

export function Chart({ data }) {
  const marginLeft = 200;
  const width = 800;
  const height = 800;
  const marginRight = 40;
  const marginTop = 20;
  const marginBottom = 20;

  const heightBound = height - marginTop - marginBottom;
  const widthBound = width - marginLeft - marginRight;

  // Filter and process the data
  
  return (
    <div>
      <p>Template for the Coding Exercise</p>
      <svg width={width} height={height}>
        {/* Render/ Draw the visualization */}
      </svg>
    </div>
  );
}
