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
      
        // 构造用于 pack 布局的数据：每个物种节点设置 value 为 100，这样理想下它的真实半径 sqrt(100)=10（但 pack 会对整个布局做缩放）
      const childrenData = records.map(d => ({
        name: d.SpeciesBinomial,
        value: 100,
        comp: d.CompMech
      }));
  
      const rootData = { children: childrenData };
  
      // 建立层级数据
      const root = d3.hierarchy(rootData)
        .sum(d => d.value);
  
      // 构造 d3.pack 布局,设置一个足够大的 size，目前设定为 [500, 500]
      const packLayout = d3.pack()
        .padding(2) // 设置2px间隙，确保小圆之间不重叠
        .size([400, 400]);
  
      // 计算 pack 布局，此时每个叶节点的 r 值不一定等于理想的 10px，它们会按整个布局尺寸比例缩放。
      packLayout(root);
  
      // 所有叶节点（每个叶节点代表一个小圆）
      const leaves = root.leaves();
      if (leaves.length === 0) return; // 如果没有数据则跳过
  
      // 由于所有叶节点原始计算出来的半径应都相等（因为 value 相同），取任意叶节点的 r 作为当前 pack 算出来的半径
      const computedLeafR = leaves[0].r;
      // 计算一个缩放比例，使得每叶节点的半径变为我们希望的10px
      const scaleRatio = desiredLeafR / computedLeafR;
  
      // 对整个层级重新缩放——即所有节点的位置和半径
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
  
      // 绘制“大圆”：大圆即包络所有小圆的外圆
      groupG.append("circle")
        .attr("cx", root.x)
        .attr("cy", root.y)
        .attr("r", root.r)
        .attr("fill", "white")
        .attr("fill-opacity", 0.05)
        .attr("stroke", "#aaa")
        .attr("stroke-opacity", 0.3);
  
      // 绘制每个小圆（叶节点）：小圆固定直径20px，颜色由 CompMech 决定（未匹配的保持默认黑色）
      leaves.forEach(leaf => {
        // 根据 comp 字段取色，若无则用黑色
        const comp = leaf.data.comp;
        const fillColor = compColorMap[comp] || "#90908E";
        
        groupG.append("circle")
          .attr("cx", leaf.x)
          .attr("cy", leaf.y)
          .attr("r", desiredLeafR)  // 固定为 10px
          .attr("fill", fillColor)
          .attr("fill-opacity",  1)
          .attr("stroke", "#fff")
          .attr("stroke-opacity", 0.3);
      });
  
      // 在大圆正中间添加文字，显示 SpeciesGrouped 名称
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
  