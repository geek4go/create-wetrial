// Change theme plugin

// import MergeLessPlugin from 'antd-pro-merge-less';
// import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';

function getModulePackageName(module) {
  if (!module.context) {
    return null;
  }

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName;
  // handle tree shaking
  if (packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }
  return packageName;
}

export default config => {
  // // pro 和 开发环境再添加这个插件
  // if (
  //   process.env.APP_TYPE === 'site' ||
  //   process.env.NODE_ENV !== 'production'
  // ) {
  //   // 将所有 less 合并为一个供 themePlugin使用
  //   const outFile = path.join(__dirname, '../.temp/ant-design-wetrial.less');
  //   const stylesDir = path.join(__dirname, '../src/');

  //   config.plugin('merge-less').use(MergeLessPlugin, [
  //     {
  //       stylesDir,
  //       outFile,
  //     },
  //   ]);

  //   config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
  //     {
  //       antDir: path.join(__dirname, '../node_modules/antd'),
  //       stylesDir,
  //       varFile: path.join(
  //         __dirname,
  //         '../node_modules/antd/es/style/themes/default.less',
  //       ),
  //       mainLessFile: outFile, //     themeVariables: ['@primary-color'],
  //       indexFileName: 'index.html',
  //       generateOne: true,
  //       lessUrl:
  //         'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
  //     },
  //   ]);
  // }
  // optimize chunks
  config.optimization
    .runtimeChunk(false) // share the same chunks across different modules
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          //   test: module => {
          //     const packageName = getModulePackageName(module);
          //     if (packageName) {
          //       return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
          //     }
          //     return false;
          //   },
          name(module) {
            const packageName = getModulePackageName(module);

            if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
              return 'viz'; // visualization package
            }
            return 'misc';
          },
        },
      },
    });

  //   // css打包成一个文件
  //   config.optimization.splitChunks({
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         test: /\.(css|less)$/,
  //         chunks: 'async',
  //         minChunks: 1,
  //         minSize: 0,
  //       }
  //     },
  //   });

  //    // exp .svg 希望不走 base64，而是全部产生 svg 文件
  //   config.module.rule('svg-with-file')
  //   .test(/.svg$/)
  //   .use('svg-with-file-loader')
  //   .loader('file-loader')
  // }
};
