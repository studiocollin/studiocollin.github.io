// .eleventy.js


const Image = require("@11ty/eleventy-img");
const embedEverything = require("eleventy-plugin-embed-everything");

module.exports = function (eleventyConfig) {
  
  //Copies videos to public
  eleventyConfig.addPassthroughCopy("src/v/**");

  //Split MD post into 2 columns
  eleventyConfig.addFilter("MyPostContent", function (content) {
    const [leftColumnContent, rightColumnContent] = content.split('<!-- split -->');
    return `
      <article class="case row">
        <div class="col-sm-3">
          ${leftColumnContent}
        </div>
        <div class="col-sm-8 offset-sm-1">
          <div class="row no-gutters">
            ${rightColumnContent}
          </div>
        </div>
      </article>`;
  });
  
  eleventyConfig.addPlugin(embedEverything, {

    }
  );  

  // Nunjuck Video
  eleventyConfig.addNunjucksShortcode("video", function(src, width, height, css, pid) {
    return `<div class="${css} preview"><video autoplay loop muted>
    <source src="/v/${pid}/${src}.mp4" type="video/mp4">
    <source src="/v/${pid}/${src}.webm" type="video/webm">
    
              Your browser does not support the video tag.
            </video></div>`;
  });
  // Nunjuck Video Shortcode (liknande struktur som Image)
eleventyConfig.addNunjucksShortcode("VideoP", function (src, alt, css, pid) {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` text for video from: ${src}`);
  }

  let videoSrcMp4 = `/v/${pid}/${src}.mp4`;
  let videoSrcWebm = `/v/${pid}/${src}.webm`;

  return `<div class="${css} preview">
    <video autoplay loop muted playsinline width="100%" aria-label="${alt}">
      <source src="${videoSrcWebm}" type="video/webm">
      <source src="${videoSrcMp4}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>`;
});
// Nunjuck Image Optimizer
  eleventyConfig.addNunjucksAsyncShortcode("Image",  async function (src, alt, css, pid) {
    if (alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on Image from: ${src}`);
    }

    let imageSrc = `src/i/${pid}/${src}`;
    let stats = await Image(imageSrc, {
        widths: [25, 320, 640, 960, 1200, 1800, 2400],
        formats: ["webp", "jpeg"],
        urlPath: "/i/"+ pid,
        outputDir: "./public/i/" + pid,
        cacheOptions: {
          duration: "1d",
          directory: ".cache",
          removeUrlQueryParams: false,
        }
      });
      let lowestSrc = stats["jpeg"][0];
    let sizes = "100vw"; // Make sure you customize this!

    // Iterate over formats and widths
    return `<div class="${css} preview"> <picture>
      ${Object.values(stats).map(imageFormat => {
      return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => `${entry.url} ${entry.width}w`).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
        <img
          alt="${alt}"
          src="${lowestSrc.url}"
          width="${lowestSrc.width}"
          >
      </picture></div>`;
  });
  
  return {
    dir: {
      input: "src",
      output: "public",
    }
  };
};
