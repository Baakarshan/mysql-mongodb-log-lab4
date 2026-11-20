"""按完整秒核验固定负载平台，保留逐秒原始计数。"""
import statistics


def assess(hits, target):
    mean = statistics.mean(hits) if hits else 0
    if not mean:
        return {"passed": False, "max_deviation_fraction": None,
                "edge_drift_fraction": None, "target_deviation_fraction": None,
                "reasons": ["正式窗口缺少请求"]}
    deviation = max(abs(x - mean) / mean for x in hits)
    drift = abs(statistics.mean(hits[-5:]) - statistics.mean(hits[:5])) / mean
    target_deviation = abs(mean / target - 1)
    reasons = []
    if deviation > 0.10:
        reasons.append("逐秒HPS偏离窗口均值超过10%")
    if drift > 0.10:
        reasons.append("前后各5秒的均值差超过窗口均值10%")
    if target_deviation > 0.10:
        reasons.append("平均发送率偏离计划超过10%")
    return {"passed": not reasons, "max_deviation_fraction": deviation,
            "edge_drift_fraction": drift, "target_deviation_fraction": target_deviation,
            "reasons": reasons}
