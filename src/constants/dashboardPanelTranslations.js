export const dashboardPanelTranslations = {
  submission: {
    title: { en: 'All My Submission', zh: '我的投稿' },
    tag: { en: 'Author', zh: '作者' },
    columns: {
      paperId: { en: 'Paper ID', zh: '论文编号' },
      paperTitle: { en: 'Paper Title', zh: '论文标题' },
      journal: { en: 'Journal', zh: '期刊' },
      status: { en: 'Status', zh: '状态' },
      submissionDate: { en: 'Submission Date', zh: '投稿日期' }
    },
    empty: { en: 'No submissions yet.', zh: '暂无投稿记录' }
  },
  review: {
    title: { en: 'All My Review', zh: '我的审稿' },
    tag: { en: 'Reviewer', zh: '审稿人' },
    columns: {
      paperId: { en: 'Paper ID', zh: '论文编号' },
      paperTitle: { en: 'Paper Title', zh: '论文标题' },
      journal: { en: 'Journal', zh: '期刊' },
      status: { en: 'Status', zh: '状态' }
    },
    empty: { en: 'No review assignments yet.', zh: '暂无审稿任务' }
  },
  editing: {
    title: { en: 'All My Editing', zh: '我的编辑' },
    tag: { en: 'Editor', zh: '编辑' },
    columns: {
      cover: { en: 'Cover', zh: '封面' },
      journalName: { en: 'Journal Name', zh: '期刊名称' },
      subject: { en: 'Subject', zh: '学科' },
      issn: { en: 'ISSN', zh: 'ISSN' }
    },
    empty: { en: 'No editing records yet.', zh: '暂无编辑记录' }
  },
  newSubmission: {
    title: { en: 'New Submission', zh: '新建投稿' },
    tag: { en: 'Author', zh: '作者' },
    form: {
      journal: {
        label: { en: 'Journal', zh: '投稿期刊' },
        placeholder: { en: 'Select journal', zh: '选择期刊' },
        required: { en: 'Please select a journal', zh: '请选择期刊' }
      },
      category: {
        label: { en: 'Paper Category', zh: '论文类别' },
        placeholder: { en: 'Select category', zh: '选择类别' },
        required: { en: 'Please select a category', zh: '请选择类别' },
        options: {
          'case-reports': { en: 'Case Reports', zh: '病例报告' },
          'commentaries': { en: 'Commentaries', zh: '评论' },
          'letters': { en: 'Letters', zh: '信件' },
          'methodology-articles': { en: 'Methodology Articles', zh: '方法论文章' },
          'original-articles': { en: 'Original Articles', zh: '原创文章' },
          'reports': { en: 'Reports', zh: '报告' },
          'research-articles': { en: 'Research Articles', zh: '研究文章' },
          'research-technical-notes': { en: 'Research/Technical Notes', zh: '研究/技术笔记' },
          'review-articles': { en: 'Review Articles', zh: '综述文章' }
        }
      },
      title: {
        label: { en: 'Paper Title', zh: '论文标题' },
        required: { en: 'Please enter paper title', zh: '请输入论文标题' }
      },
      authors: {
        label: { en: 'Author List', zh: '作者列表' },
        required: { en: 'Please enter author list', zh: '请输入作者列表' }
      },
      abstract: {
        label: { en: 'Abstract', zh: '摘要' },
        required: { en: 'Please enter abstract', zh: '请输入摘要' }
      },
      keywords: {
        label: { en: 'Keywords', zh: '关键词' },
        required: { en: 'Please enter keywords', zh: '请输入关键词' }
      },
      pages: {
        label: { en: 'Number of Pages', zh: '页数' },
        placeholder: { en: 'Pages', zh: '页数' },
        required: { en: 'Please select number of pages', zh: '请选择页数' }
      },
      fields: {
        label: { en: 'Paper Fields', zh: '论文领域' },
        required: { en: 'Please enter paper fields', zh: '请输入论文领域' }
      },
      paperFile: {
        label: { en: 'Paper File', zh: '论文文件' },
        button: { en: 'Choose File', zh: '选择文件' },
        required: { en: 'Please upload paper file', zh: '请上传论文文件' },
        note: {
          close: { en: 'Please make sure to close the file you want to upload.', zh: '请确保您要上传的文件已关闭。' },
          formats: { en: 'doc,docx,pdf,zip,rar formats are accepted. Maximum file size is 10 MB.', zh: '支持 doc,docx,pdf,zip,rar 格式。最大文件大小为 10 MB。' }
        }
      },
      graphicFile: {
        label: { en: 'Graphic File', zh: '图表文件' },
        button: { en: 'Choose File', zh: '选择文件' },
        note: {
          close: { en: 'Please make sure to close the file you want to upload.', zh: '请确保您要上传的文件已关闭。' },
          formats: { en: 'jpg,jpeg,gif,png,tif,psd,eps,rar,zip formats are accepted. Maximum file size is 20 MB.', zh: '支持 jpg,jpeg,gif,png,tif,psd,eps,rar,zip 格式。最大文件大小为 20 MB。' },
          compress: { en: '(Before uploading multiple pictures, please compress them into a .zip or .rar file.)', zh: '（上传多张图片前，请将其压缩为 .zip 或 .rar 文件。）' }
        }
      },
      code: {
        label: { en: 'Verification Code', zh: '验证码' },
        required: { en: 'Please enter verification code', zh: '请输入验证码' },
        error: { en: 'Incorrect verification code', zh: '验证码错误' }
      },
      submit: { en: 'Submit', zh: '提交' }
    }
  }
}
