# Requires python3 to work since, python 3< does not implement %z.

import sys

sys.path += ["/Users/diasbruno/.local/lib/python3.7/site-packages"]

from datetime import datetime
from subprocess import Popen, PIPE
import semver
import functools


# 1: version, 2: date, 3: dashes, 4: entries
LOG_ENTRY = """{}
{}

{}
"""


head_version = "HEAD"


def git_exec(args):
    p = Popen(" ".join(["git"] + args), shell=True, stdout=PIPE, stderr=PIPE)
    out, err = p.communicate()
    return out.decode('utf-8')


def git_log(args):
    return git_exec(["log"] + args)


def log_entry(entry):
    log = entry.split(' ')
    hash = log[0]
    log = ' '.join(log[1:])

    return "- [%s](../../commit/%s) %s" % (hash, hash, log)


def get_tags_date(tag):
    args = [tag, "-1", '--format="%ad"']
    date_time = git_log(args).split('\n')[0]

    if date_time != '':
        dt = datetime.strptime(date_time, '%a %b %d %H:%M:%S %Y %z')
    else:
        dt = datetime.now()
    dt = dt.strftime('%a, %d %b %Y %H:%M:%S')
    return dt


def log_in_between_versions(t):
    (a, b, logs) = t

    v = b and to_version(b) or head_version
    dt = get_tags_date(v)

    header = "{} - {} UTC".format(b or head_version, dt)
    dashes = ("-" * len(header))

    def write_log(acc, log):
        if log[8:8+7] == 'Release' or log[8:8+7] == 'release':
            return acc
        acc.append(log_entry(log))
        return acc

    actual_log = list(functools.reduce(write_log,
                                       logs.splitlines(),
                                       []))

    if len(actual_log) == 0:
        entries = '-\n\n'
    else:
        entries = "\n".join(actual_log)

    return LOG_ENTRY.format(header, dashes, entries)


def adjacents(ls, f, res):
    if len(ls) == 0:
        return res

    first = ls[0]
    if len(ls) == 1:
        next = None
    else:
        next = ls[1]

    res.append(f(first, next))
    return adjacents(ls[1:], f, res)


def to_version(tag):
    if not tag:
        return "HEAD"
    if tag.prerelease:
        return str(tag)
    return "v{}".format(tag)


def logs_between(base, b):
    to = to_version(b)
    between = "{}..{}".format(to_version(base), to)
    logs = git_log([between, "--format='%h %s'"])
    return (base, b, logs)


def parse_version(version):
    if version == 'HEAD':
        return version
    if version[0] == 'v':
        version = version[1:]
    return semver.parse_version_info(version)


def get_all_tags():
    lines = git_exec(["tag", "-l"])
    versions = map(parse_version, lines.splitlines())
    return sorted(versions)


def generate_current():
    versions = get_all_tags()
    base = versions[-1]
    logs = logs_between(base, None)
    return [log_in_between_versions(logs)]


def generate_all():
    versions = get_all_tags()
    log_versions = adjacents(versions, logs_between, [])
    vs = map(log_in_between_versions, log_versions)
    return list(vs)


if __name__ == "__main__":
    argc = len(sys.argv)

    if sys.argv[1] == '-a':  # all
        head_version = sys.argv[2] if argc > 2 else "HEAD"
        log = generate_all()
        log.reverse()

    elif sys.argv[1] == '-c':  # current
        head_version = sys.argv[2]
        log = generate_current()

    print("\n".join(log))
