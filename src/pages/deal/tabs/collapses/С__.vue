<div ng-show="show.PTS">
<div class="a-report-data">
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="dealGeneral.registrationMark"
    ng-show="deal.auto.registrationMark"
  >
    <div class="a-report-data-label">Гос. номер</div>
    <div class="a-report-data-text">{{::deal.auto.registrationMark}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.elCertificateNumber"
    ng-show="deal.auto.elCertificateNumber"
  >
    <div class="a-report-data-label">Номер ЭПТС</div>
    <div class="a-report-data-text">{{::deal.auto.elCertificateNumber}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.ElCertificateIssuedDate"
    ng-show="deal.auto.ElCertificateIssuedDate"
  >
    <div class="a-report-data-label">Дата выдачи ЭПТС</div>
    <div class="a-report-data-text">{{::deal.auto.ElCertificateIssuedDate}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.certificateNumber"
    ng-show="deal.auto.certificateNumber"
  >
    <div class="a-report-data-label">Номер ПТС</div>
    <div class="a-report-data-text">{{::deal.auto.certificateNumber}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.brandByVC"
    ng-show="deal.auto.brandByVC && deal.dealStatus >= dealStatusEnum.analyticResponse"
  >
    <div class="a-report-data-label">Марка по ПТС</div>
    <div class="a-report-data-text">{{::deal.auto.brandByVC}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.modelByVC"
    ng-show="deal.auto.modelByVC && deal.dealStatus >= dealStatusEnum.analyticResponse"
  >
    <div class="a-report-data-label">Модель по ПТС</div>
    <div class="a-report-data-text">{{::deal.auto.modelByVC}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.issuedDate"
    ng-show="deal.auto.issuedDate"
  >
    <div class="a-report-data-label">Дата выдачи ПТС</div>
    <div class="a-report-data-text">{{::deal.auto.issuedDate}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.issuedBy"
    ng-show="deal.auto.issuedBy"
  >
    <div class="a-report-data-label">ПТС выдан</div>
    <div class="a-report-data-text">{{::deal.auto.issuedBy}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="dealGeneral.countHostsByVC"
    ng-show="deal.auto.countHostsByVC"
  >
    <div class="a-report-data-label">Количество хозяев по ПТС</div>
    <div class="a-report-data-text">{{::deal.auto.countHostsByVC}}</div>
  </div>
  <div class="a-report-data-item a-no-clearfix" user-permission="dealGeneral.isPTSOriginal">
    <div class="a-report-data-label">ПТС оригинальный</div>
    <div class="a-report-data-text">{{::deal.auto.isOriginalVCText}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.bodyColorByVC"
    ng-show="deal.auto.bodyColorByVC"
  >
    <div class="a-report-data-label">Цвет кузова</div>
    <div class="a-report-data-text">{{::deal.auto.bodyColorByVC}}</div>
  </div>
  <div
    class="a-report-data-item a-no-clearfix"
    user-permission="PTS.engineCapacityByVC"
    ng-show="deal.auto.engineCapacityByVC"
  >
    <div class="a-report-data-label">Объем двигателя</div>
    <div class="a-report-data-text">{{::deal.auto.engineCapacityByVC}}</div>
  </div>
</div>