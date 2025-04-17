d3.csv("src/dataset.csv").then(data => {

    const groupsData = d3.group(data, d => d.SpeciesGrouped);
    
    const compColorMap = {
      "Behaviour": "#64F7FF",
      "Demographic": "#E3F639",
      "Physiological": "#EE5EBE"
    };

    const groupPositionMap = {
        "Birds": { x: 1113, y: 495 },
        "Plantae": { x: 440, y: 600 },
        "Mammalia": { x: 815, y: 370 },
        "Arthropoda": { x: 530, y: 300 },
        "Angiospermae": { x: 730, y: 620 },
        "Amphibia": { x: 715, y: 420 },
        "Algae & Cyanobacteria": { x: 540, y: 700 },
        "Reptilia": { x: 930, y: 710 },
        "arthropoda": { x: 800, y: 190 },
        "Gymnospermae": { x: 340, y: 460 },
        "Mollusca": { x: 1075, y: 230 },
        "Worm": { x: 960, y: 230 },
        "Fish": { x: 1000, y: 720 },
    };
  
    const svg = d3.select("#viz")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);
  
    // Temporary position for better sight: right half of screen
    const offsetX = window.innerWidth * 0.6;
    let currentOffsetY = 30;  // top padding by default
    const verticalMargin = 10;
  
    // SpeciesBinomial circles R
    const desiredLeafR = 10;  
  
    // 对于每个 SpeciesGrouped 生成一个包布局
    groupsData.forEach((records, groupName) => {
        console.log("groupName:", groupName);
      
      const childrenData = records.map(d => ({
        name: d.SpeciesBinomial,
        value: 100,
        comp: d.CompMech
      }));
  
      const rootData = { children: childrenData };
  
      const root = d3.hierarchy(rootData)
        .sum(d => d.value);
  
      const packLayout = d3.pack()
        .padding(2)
        .size([400, 400]);
  
      packLayout(root);
  
      const leaves = root.leaves();
      if (leaves.length === 0) return;
  
      const computedLeafR = leaves[0].r;
      const scaleRatio = desiredLeafR / computedLeafR;
  
      root.each(node => {
        node.x *= scaleRatio;
        node.y *= scaleRatio;
        node.r *= scaleRatio;
      });
  
      // 此时，root.r 是包围所有小圆的“大圆”的半径
      // 将 pack 布局结果平移，使得大圆中心位于 (offsetX, currentOffsetY + root.r)
      //   const translateX = offsetX - root.x;
      //   const translateY = (currentOffsetY + root.r) - root.y;
      const position = groupPositionMap[groupName] || { x: offsetX, y: currentOffsetY + root.r };
      const translateX = position.x - root.x;
      const translateY = position.y - root.y;

  
      // 为当前组创建一个 <g> 容器，便于整体平移
      const groupG = svg.append("g")
        .attr("transform", `translate(${translateX}, ${translateY})`);
  
      // Big Circles Drawing
      groupG.append("circle")
        .attr("cx", root.x)
        .attr("cy", root.y)
        .attr("r", root.r)
        .attr("fill", "white")
        .attr("fill-opacity", 0.05)
        .attr("stroke", "#aaa")
        .attr("stroke-opacity", 0.3);
  
      
      leaves.forEach(leaf => {
        // 根据 comp 字段取色
        const comp = leaf.data.comp;
        const fillColor = compColorMap[comp] || "#90908E";
        
      groupG.append("circle")
        .attr("cx", leaf.x)
        .attr("cy", leaf.y)
        .attr("r", desiredLeafR)
        .attr("fill", fillColor)
        .attr("fill-opacity",  1)
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 0.3);
      });
  
      groupG.append("text")
        .attr("x", root.x)
        .attr("y", root.y)
        // .attr("fill", "#fff")
        .attr("class", "group-label")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(groupName);
  
      // 更新下一组的纵向起点：当前组大圆直径 + margin
      // currentOffsetY += root.r * 2 + verticalMargin;
    });
  });
  